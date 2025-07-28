const messages = document.getElementById("messages");
const startBtn = document.getElementById("startBtn");
const options = document.getElementById("options");
const another = document.getElementById("another");
const optionBtns = document.querySelectorAll(".optionBtn");
const anotherYes = document.getElementById("anotherYes");
const anotherNo = document.getElementById("anotherNo");
const steam = document.getElementById("steam");

const brewSound = document.getElementById("brewSound");
const readySound = document.getElementById("readySound");

let coffeeCount = 0;
const coffeeCounter = document.getElementById("coffeeCounter");
const count = document.getElementById("count");

let steps = [
  "☕ Starting the coffee machine...",
  "💧 Adding water...",
  "🫘 Grinding coffee beans...",
  "🔥 Brewing your coffee...",
];

function fadeOutAudio(audio) {
  let fade = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      clearInterval(fade);
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1; // reset for next brew
    }
  }, 100);
}

function brewCoffee() {
  // Hide Start button completely during brewing
  startBtn.style.display = "none";
  messages.textContent = "";

  // Show steam
  steam.classList.remove("hidden");

  // Play brewing sound in loop
  brewSound.currentTime = 0;
  brewSound.loop = true;
  brewSound.volume = 1;
  brewSound.play();

  let i = 0;
  const interval = setInterval(() => {
    messages.textContent = steps[i];
    i++;
    if (i >= steps.length) {
      clearInterval(interval);
      fadeOutAudio(brewSound); // fade out brewing sound
      steam.classList.add("hidden"); // Hide steam
      options.classList.remove("hidden"); // Show sugar options
    }
  }, 1500);
}

anotherYes.addEventListener("click", () => {
  another.classList.add("hidden");
  messages.textContent = "Let's brew another one!";
  setTimeout(brewCoffee, 1000);
});

anotherNo.addEventListener("click", () => {
  another.classList.add("hidden");
  messages.textContent = "👋 Thanks for using the coffee machine!";
  startBtn.style.display = "inline-block"; // Show Start button again
});

startBtn.addEventListener("click", brewCoffee);

optionBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const answer = e.target.dataset.answer;
    options.classList.add("hidden");
    if (answer === "yes") {
      messages.textContent = "🥛 Adding milk and sugar...";
    } else {
      messages.textContent = "🚫 No sugar added...";
    }

    setTimeout(async () => {
      readySound.play(); // Play ding sound after brewing
      messages.textContent = "✨ Your coffee is ready! Enjoy! ☕";
      const res = await fetch("/api/count", { method: "POST" });
      const data = await res.json();
      count.textContent = data.count;

      coffeeCounter.classList.remove("hidden");
      another.classList.remove("hidden");
    }, 1500);
  });
});

async function updateCounter() {
  const res = await fetch("/api/count", { method: "POST" });
  const data = await res.json();
  count.textContent = data.count;
  coffeeCounter.classList.remove("hidden");
}

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/count");
  const data = await res.json();
  count.textContent = data.count;
  coffeeCounter.classList.remove("hidden");
});
