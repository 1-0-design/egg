// Simple test for iTunes API
// Use this to directly test the iTunes API in dev tools console

// Test searching for music
async function testSearch(query = "taylor swift") {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5`, 
      { mode: 'cors' }
    );
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`iTunes API returned ${data.resultCount} results for "${query}"`);
    
    // Check if artwork URLs are working
    if (data.results && data.results.length > 0) {
      const firstTrack = data.results[0];
      console.log('First track:', firstTrack);
      
      if (firstTrack.artworkUrl100) {
        // Try to get 600x600 artwork
        const largeArtwork = firstTrack.artworkUrl100.replace('100x100', '600x600');
        console.log('Original artwork:', firstTrack.artworkUrl100);
        console.log('Larger artwork:', largeArtwork);
        
        // Test loading the images
        const img1 = new Image();
        img1.onload = () => console.log('✅ Original artwork loaded successfully');
        img1.onerror = () => console.error('❌ Original artwork failed to load');
        img1.src = firstTrack.artworkUrl100;
        
        const img2 = new Image();
        img2.onload = () => console.log('✅ Larger artwork loaded successfully');
        img2.onerror = () => console.error('❌ Larger artwork failed to load');
        img2.src = largeArtwork;
      } else {
        console.warn('No artwork URL in the first track result');
      }
      
      // Check preview URL
      if (firstTrack.previewUrl) {
        console.log('Preview URL:', firstTrack.previewUrl);
        
        // Test if audio previews work
        const audio = new Audio();
        audio.oncanplaythrough = () => {
          console.log('✅ Audio preview can be played');
          audio.pause(); // Don't actually play it
        };
        audio.onerror = () => console.error('❌ Audio preview failed to load');
        audio.src = firstTrack.previewUrl;
      } else {
        console.warn('No preview URL in the first track result');
      }
    }
    
    return data.results;
  } catch (error) {
    console.error('Test failed:', error);
    return null;
  }
}

// Run the test
console.log('Starting iTunes API test...');
testSearch()
  .then(results => {
    if (results) {
      console.log('Test completed with results');
    } else {
      console.log('Test failed or returned no results');
    }
  });