import axios from "axios";
import { exec } from "child_process";

// Replace 'IB3593' with the desired product ID
const productId = "IB3593";
const apiUrl = `https://www.adidas.com.ar/api/products/${productId}/availability`;

// The interval at which to check the product availability, in milliseconds
const checkInterval = 1000 * 60 * 10;

// The sizes for which to trigger the sound
const targetSizes = ["XS", "S", "M", "XL"];

function playSound(time = 0) {
  // Play alert sound using the 'afplay /System/Library/Sounds/Glass.aiff' command on macOS or Linux,
  // or the 'powershell [System.Console]::Beep(300, 500)' command on Windows
  console.log("\u0007");
  exec("afplay /System/Library/Sounds/Glass.aiff", (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  setTimeout(() => {
    if (time < 5) {
      playSound(time + 1);
    }
  }, 1000);
}

// Function to check the product availability
async function checkAvailability() {
  try {
    console.log(`Fetching... ${new Date().toLocaleString("es-AR")}`);

    // Make a GET request to the API using axios
    const res = await axios.get(apiUrl, { json: true });
    const body = res.data;

    // Check if any of the target sizes are available
    const targetSizesAvailable = body.variation_list.filter(
      (variation) =>
        targetSizes.includes(variation.size) &&
        variation.availability > 0 &&
        variation.availability_status === "AVAILABLE"
    );

    if (targetSizesAvailable.length) {
      console.log(
        `🏆 The following variations are now available: \n`,
        targetSizesAvailable
      );
      playSound();

      // Checkout link
      console.log(
        `🛒 Check them out at 👉 https://www.adidas.com.ar/camiseta-titular-argentina-3-estrellas-2022/IB3593.html`
      );
    }
  } catch (err) {
    console.error(err);
  }
}

// Call the function initially
checkAvailability();

// Set up a loop to call the function at the specified interval
setInterval(checkAvailability, checkInterval);
