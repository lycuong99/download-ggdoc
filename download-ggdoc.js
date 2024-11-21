async function downloadAllCanvasImages() {
    const scrollContainer = document.querySelector('.kix-appview-editor');
    scrollContainer.scrollTop = 0;
    
    const imageUrls = new Set();
    
    function getCanvasImageUrls() {
        console.log(`getCanvasImageUrls`)
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            try {
                const imageUrl = canvas.toDataURL('image/png');
                if (!imageUrls.has(imageUrl)) {
                    imageUrls.add(imageUrl);
                }
            } catch (error) {
                console.warn('Không thể lấy hình từ canvas:', error);
            }
        });
    }
    
    function scrollPage() {
        return new Promise(resolve => {
            scrollContainer.scrollBy(0, 400);
            
            setTimeout(() => {
                getCanvasImageUrls();
                resolve();
            }, 500);
        });
    }
    
    // Cuộn hết page
    while (scrollContainer.scrollTop < scrollContainer.scrollHeight - window.innerHeight) {
        await scrollPage();
    }
    
    // Cuộn về đầu trang để reset
    scrollContainer.scrollTop = 0;
    
    // Đợi một chút để render lại
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Thu thập lại toàn bộ hình
    getCanvasImageUrls();
    
    const imageUrlArray = Array.from(imageUrls);
    
    function downloadImage(url, index) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `image_${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Download toàn bộ hình
    imageUrlArray.forEach((url, index) => {
      
        setTimeout(
            () => {
                downloadImage(url, index);
            },
            index * 200 // Delay download every 200ms
          );
    });
    
    console.log(`Đã download ${imageUrlArray.length} hình ảnh`);
}

// Chạy hàm
// downloadAllCanvasImages();