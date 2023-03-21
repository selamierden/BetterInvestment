var photos = [
    {
        image : "img/slider1.png"
    },

    {
        image : "img/slider2.png"
    },

    {
        image : "img/slider3.png"
    }
]

var index = 0;
let count = photos.length;

showSlide(index);

// document.querySelector(".card-img-top").setAttribute('src',photos[index].image);
// document.querySelector(".card-title").textContent = photos[index].name;

document.querySelector(".fa-arrow-circle-left").addEventListener('click',function(){
    index--;
    if (index == -1){
        index = 7;
    }
    showSlide(index);
});

document.querySelector(".fa-arrow-circle-right").addEventListener('click',function(){
    index++;
    if (index > count-1){
        index = 0;
    }
    showSlide(index);
});

function showSlide (index) {
    document.querySelector(".card-img-top").setAttribute('src',photos[index].image);
}
