document.addEventListener('DOMContentLoaded',function () {
    upperQuery=document.querySelector("#upper");
    upperTextQuery=document.querySelector('.upper-text');
    cokeZeroQuery=document.querySelector('#coke-zero');
    
    const viewHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    
    let pixelHeight = -viewHeight * 0.5;
    let displaceLeft = -pixelHeight/viewWidth * 100;
    console.log(displaceLeft);
    
    var newWidth
    upperQuery.style.left = pixelHeight + 'px';

    upperTextQuery.style.left = displaceLeft + 33 + 'vw';
    cokeZeroQuery.style.left = displaceLeft + 18 + 'vw';


    document.getElementById('target').addEventListener('mousemove', function(location){
        mouse_monitor(location);
    })

    function mouse_monitor(e) {
        var screenWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        let maxWidth = viewHeight + screenWidth;
        newWidth = (e.pageX / screenWidth) * maxWidth;
        upper.style.width = newWidth + 'px'
      }
})