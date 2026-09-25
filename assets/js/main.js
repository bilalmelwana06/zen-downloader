(function(){var b=document.querySelector('.menu-btn'),l=document.querySelector('.links');
if(b&&l){b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});}
var y=document.getElementById('yr');if(y){y.textContent=new Date().getFullYear();}})();
