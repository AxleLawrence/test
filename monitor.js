function showSection(sectionId, button) {
    document.querySelectorAll('.sub-tab-content').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.sub-tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    fetchSensorData();
}

function fetchSensorData() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            // Update date values
            document.getElementById('year-value').textContent = data.year;
            document.getElementById('month-value').textContent = data.month;
            document.getElementById('day-value').textContent = data.day;
            
            // Update time values
            document.getElementById('hour-value').textContent = data.hour;
            document.getElementById('minute-value').textContent = data.minute;
            document.getElementById('second-value').textContent = data.second;
            
            // Only update temperature, humidity, and moisture
            document.getElementById('temp-value').textContent = `${data.temperature} °C`;
            document.getElementById('humidity-value').textContent = `${data.humidity} %`;
            document.getElementById('moisture-value').textContent = `${data.moisture} %`;
        })
        .catch(error => console.error('Error fetching sensor data:', error));
}

// Update flipclock values with a flip effect
function updateValue(id, value) {
    const element = document.getElementById(id);
    if (element.textContent !== value) {
        element.classList.add('flip');
        setTimeout(() => {
            element.textContent = value;
            element.classList.remove('flip');
        }, 300); // Time for flip effect to complete
    }
}



function fetchImages() {
    fetch('/getimages')
        .then(response => response.json())
        .then(data => {
            let gallery = document.getElementById('imageGallery');
            gallery.innerHTML = ''; // Clear previous images to avoid duplicates
            
            data.forEach(imagePath => {
                let imgElement = document.createElement('img');
                imgElement.src = imagePath;  // Image from ESP32
                gallery.appendChild(imgElement);
            });
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
  }
    

// Fetch data every second, but only update if the second is divisible by 10
setInterval(fetchSensorData, 1000);
fetchImages();
// Initial fetch on page load

document.addEventListener("DOMContentLoaded", () => {
  // Check if there's a stored active tab in localStorage
  const activeTab = localStorage.getItem('activeTab');
  
  if (activeTab) {
      // If there's an active tab, show it and activate the corresponding button
      const activeButton = document.querySelector(`.sub-tab-button[onclick="showSection('${activeTab}', this)"]`);
      showSection(activeTab, activeButton);
  } else {
      // If no tab is stored, default to the 'data' tab (or any default tab)
      const defaultButton = document.querySelector('.sub-tab-button');
      showSection('data', defaultButton);
  }

  // Initial fetch on page load
  fetchSensorData();
});

function fetchImages() {
    // Simulating an API call to fetch images from Lorem Picsum
    const numberOfImages = 50; // Number of images to fetch (you can change this)
    
    const gallery = document.getElementById('imageGallery');
    
    // Clear any previous images to avoid duplicates
    gallery.innerHTML = '';

    // Loop through the number of images you want to fetch
    for (let i = 0; i < numberOfImages; i++) {
        let imgElement = document.createElement('img');
        
        // Generate a random image URL from Lorem Picsum
        imgElement.src = `https://picsum.photos/300/200?random=${i}`;
        
        // Optionally, you can add alt text or other attributes to the image
        imgElement.alt = `Random Image ${i + 1}`;

        // Add event listener to handle image click (zoom effect)
        imgElement.addEventListener('click', () => zoomImage(imgElement.src));

        gallery.appendChild(imgElement); // Append the image to the gallery
    }
}

function zoomImage(imageSrc) {
    // Create a modal overlay
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Create a modal image element
    const modalImage = document.createElement('img');
    modalImage.src = imageSrc; // Set the large version of the image
    modalImage.classList.add('modal-content');

    // Style modal (ensure it's full-screen)
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw'; // 100% of the viewport width
    modal.style.height = '100vh'; // 100% of the viewport height
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dark background
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Style the image to take up as much space as possible while maintaining aspect ratio
    modalImage.style.maxWidth = '100%'; // Ensure the image fits within the viewport
    modalImage.style.maxHeight = '100%'; // Ensure the image fits within the viewport
    modalImage.style.objectFit = 'contain'; // Maintain aspect ratio of the image

    // Close the modal when clicked outside of the image
    modal.addEventListener('click', () => {
        modal.remove(); // Remove the modal from DOM
    });

    // Append the modal image to the modal
    modal.appendChild(modalImage);
    document.body.appendChild(modal); // Append the modal to the body
}
