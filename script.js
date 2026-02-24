const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

document.getElementById("startBtn").addEventListener("click", init);

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(250, 250, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    document.getElementById("startBtn").disabled = true;
    document.getElementById("startBtn").innerText = "กำลังทำงาน...";
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            `${prediction[i].className} : ${(prediction[i].probability * 100).toFixed(2)}%`;
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
