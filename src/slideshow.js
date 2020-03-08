var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("slide");
  var dots = document.getElementsByClassName("demo");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" w3-white", "");
  }
  x[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " w3-white";
}

document.getElementById("left").addEventListener("click", function() {
    plusDivs(-1);
})

document.getElementById("right").addEventListener("click", function() {
    plusDivs(1);
})

document.getElementById("dot1").addEventListener("click", function() {
    currentDiv(1);
})

document.getElementById("dot2").addEventListener("click", function() {
    currentDiv(2);
})

document.getElementById("dot3").addEventListener("click", function() {
    currentDiv(3);
})

document.getElementById("dot4").addEventListener("click", function() {
    currentDiv(4);
})
