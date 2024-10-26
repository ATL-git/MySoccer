const items = document.querySelectorAll(".item");
let imageUrls = [
    "/assets/img/t1.jpg",
    "/assets/img/t2.jpg",
    "/assets/img/t3.jpg",
    "/assets/img/t4.jpg",
];

let deviceType = "";
let events = {
    mouse: {
        start: "mouseover",
        end: "mouseout",
    },
    touch: {
        start: "touchstart",
        end: "touchend",
    },
};

const isTouchDevice = () => {
    try {
        document.createEvent("touchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false
    }
};

isTouchDevice();

items.forEach((item, index) => {
    let img = document.createElement("img");
    img.setAttribute("src", imageUrls[index]);
    img.style.width = "100%";
    img.style.cursor = "initial";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    item.appendChild(img);
    item.style.flex = "1";
    item.style.transition = "flex 0.7s ease";
    
    let filtre = document.createElement("div");
    filtre.classList.add("filtreImg");
    item.appendChild(filtre)
    let textFiltre = document.createElement("p");
    textFiltre.classList.add("textFiltre");
    filtre.appendChild(textFiltre);
    let textFiltreOne = document.createElement("p");
    textFiltreOne.classList.add("textFiltre");
    filtre.appendChild(textFiltreOne);
    let textFiltreTwo = document.createElement("p");
    textFiltreTwo.classList.add("textFiltre");
    filtre.appendChild(textFiltreTwo);

        switch (index) {
            case 0:
                textFiltre.innerHTML = "Terrain Indoor";
                textFiltreOne.innerHTML = "(Synthetique)";
                textFiltreTwo.innerHTML = "5 x 5";
                break;
            case 1:
                textFiltre.innerHTML = "Terrain Outdoor";
                textFiltreOne.innerHTML = "(Synthetique)";
                textFiltreTwo.innerHTML = "5 x 5";
                break;
            case 2:
                textFiltre.innerHTML = "Terrain Indoor";
                textFiltreOne.innerHTML = "(Synthetique)";
                textFiltreTwo.innerHTML = "6 x 6";
                break;
            case 3:
                textFiltre.innerHTML = "Terrain Outdoor";
                textFiltreOne.innerHTML = "(Synthetique)";
                textFiltreTwo.innerHTML = "6 x 6";
                break;
        }
    

    item.addEventListener(events[deviceType].start, () => {
        filtre.classList.add("filtreImgOver");
        item.style.flex = "5";
    });
    item.addEventListener(events[deviceType].end, () => {
        filtre.classList.remove("filtreImgOver");
        item.style.flex = "1";
    });
});