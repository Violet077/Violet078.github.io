document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('tweetModal');
    const tweetButton = document.querySelector('.tweet-button');
    const sendTweetButton = document.getElementById('sendTweet');
    const tweetTextarea = modal.querySelector('textarea');
    const tweetImageInput = modal.querySelector('input[type="file"]');
    const mainContent = document.querySelector('main');
    const menu = document.querySelector('.menu');
    const userDropdown = document.getElementById('userDropdown');
    const addUserLink = document.getElementById('addUser');
    const userLinks = userDropdown.querySelector('.dropdown-content');
	// Kode untuk memposting tweet secara acak
    const randomTweets = [
		{
			text: "Hari ini cuaca sangat cerah, sempurna untuk berjalan-jalan!",
			image: "foto/1.jpg"
		},
		{
			text: "Saya baru saja menemukan restoran baru yang luar biasa. Mereka memiliki hidangan lezat!",
			image: "foto/10.jpg"
		},
		{
			text: "Hari ini cuaca sangat cerah, sempurna untuk berjalan-jalan!"
		},
		{
			text: "Saya baru saja menemukan restoran baru yang luar biasa. Mereka memiliki hidangan lezat!"
		},
		// Tambahkan objek tweet lainnya di sini
	];

	const specialTweets = [
    // ...
		{
			text: "Ini adalah tweet khusus untuk pengguna IU!",
			image: `foto/${Math.floor(Math.random() * 50) + 51}.jpg`,
			profileImage: "foto/80.jpg",
			username: "IU",
			isVerified: true,
			chance: 0.5
		},
		{
			text: "Ini adalah tweet khusus untuk pengguna Millet!",
			image: `foto/${Math.floor(Math.random() * 50) + 1}.jpg`,
			profileImage: "foto/34.jpg",
			username: "Millet",
			isVerified: true,
			chance: 0.5
		},
		// ...
	];
	const usedImageIndices = {
		IU: [],
		Millet: [],
		// ... add other special users here
	};
	// Test the createTweetElement function


    let activeUser = null;
    let likedTweets = {};
	
	function addDummyUsers() {
        for (let i = 1; i <= 1000; i++) {
            const newUsername = `user${i}`;
            addUser(newUsername);
        }
    }

    // Panggil fungsi untuk menambahkan 1000 user dummy saat dokumen selesai dimuat
    addDummyUsers();


    function toggleModal(displayStyle) {
        modal.style.display = displayStyle;
    }

    function handleTweetSubmit() {
		const tweetText = tweetTextarea.value.trim();
		const tweetImage = tweetImageInput.files[0];

		if (!tweetText && !tweetImage) {
			alert("Please write something or select an image to tweet!");
			return;
		}

		const newTweet = createTweetElement(tweetText, tweetImage, activeUser);
		if (newTweet) {
			mainContent.insertBefore(newTweet, mainContent.firstChild);
		}

		tweetTextarea.value = '';
		tweetImageInput.value = ''; // Clear the input
		toggleModal('none');
	}
	
	function getUsernameLengthClass(username) {
		const usernameLength = username.length;

		if (usernameLength < 5) {
			return 'small-username';
		} else if (usernameLength < 10) {
			return 'medium-username';
		} else {
			return 'large-username';
		}
	}

    function createTweetElement(tweetText, tweetImage, username, isVerified = false) {
		// Check if username is defined before calling getUsernameLengthClass
		if (!username) {
			return null; // Or handle this case based on your logic
		}
		
		const tweetId = `tweet-${Date.now()}`;
		likedTweets[tweetId] = {};

		const newTweet = document.createElement('div');
		newTweet.setAttribute('id', tweetId);
		newTweet.classList.add('tweet');

		const usernameLengthClass = getUsernameLengthClass(username);

		let tweetContent = `
			<div class="user-info">
				<div class="user-image ${usernameLengthClass}">
					<div class="user-image-wrapper">
						<img src="${getProfileImage(username)}" alt="Profile Image">
					</div>
				</div>
				<span class="user-name">${username}</span>
				${isVerified ? '<img src="icon.png" alt="Verified" class="verified-badge">' : ''}
				<span>@${username}</span>
			</div>
			<div>${tweetText}</div>
		`;

		// Tambahkan kode untuk menampilkan gambar jika ada
		if (tweetImage) {
			tweetContent += `<img src="${tweetImage}" alt="Tweet Image" class="tweet-image">`;
		}

		tweetContent += `
			<div class="actions">
				<span class="action like">❤️ Like <span class="like-count">0</span></span>
				<span class="action retweet">🔁 Retweet</span>
				<span class="action heart">🗨️ Komen</span>
				<div class="likes-list"></div>
			</div>
		`;

		newTweet.innerHTML = tweetContent;
		newTweet.querySelector('.actions').addEventListener('click', toggleActionActive);

		return newTweet;
	}

	function getProfileImage(username) {
		const specialTweet = specialTweets.find(tweet => tweet.profileImage && tweet.username === username);
		return specialTweet ? specialTweet.profileImage : 'none.jpg'; // Ganti 'default_profile.jpg' dengan URL gambar profil default
	}


    function toggleActionActive(event) {
        const action = event.target;
        const tweet = action.closest('.tweet');
        const tweetId = tweet.getAttribute('id');

        if (action.classList.contains('like')) {
            const likeCount = action.querySelector('.like-count');
            const hasLiked = likedTweets[tweetId][activeUser];

            likedTweets[tweetId][activeUser] = !hasLiked;
            updateLikes(tweetId, tweet);
        }

        if (action.classList.contains('heart')) {
            action.textContent = action.classList.contains('active') ? '🔴' : '❤️';
            action.classList.add('animate');
            setTimeout(() => action.classList.remove('animate'), 300);
        }
    }

    function updateLikes(tweetId, tweet) {
        const likeCount = tweet.querySelector('.like-count');
        const likedUsers = likedTweets[tweetId];
        const currentLikes = Object.values(likedUsers).filter(Boolean).length;

        likeCount.textContent = currentLikes;
    }

    function toggleDropdownDisplay() {
        const dropdownContent = userDropdown.querySelector('.dropdown-content');
        dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
    }

    function switchUser(event) {
        event.preventDefault();
        activeUser = this.dataset.username;
        toggleDropdownDisplay();
    }
	function saveUserListToCSV() {
    const userList = Object.keys(likedTweets).filter(username => username !== activeUser);
    const csvContent = 'data:text/csv;charset=utf-8,' + userList.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'user_list.csv');
    link.click();
}

// Function to load user list from a CSV file
function loadUserListFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const userList = content.split('\n').map(username => username.trim());

        userList.forEach(username => {
            if (username) {
                if (!likedTweets.hasOwnProperty(username)) {
                    addUser(username); // Call the addUser function directly
                }
            }
        });
    };
    reader.readAsText(file);
}



// Add event listener to "Save" button
const saveButton = document.createElement('button');
saveButton.textContent = 'Save User List';
saveButton.addEventListener('click', saveUserListToCSV);
menu.appendChild(saveButton);

const loadButton = document.createElement('button');
loadButton.textContent = 'Load User List';
const fileInput = document.createElement('input');
fileInput.setAttribute('type', 'file');
fileInput.style.display = 'none';

// Add event listener to "Load" button to trigger file input click
loadButton.addEventListener('click', () => fileInput.click());

// Add event listener to file input for loading
fileInput.addEventListener('change', loadUserListFromCSV);

// Append the buttons and input to the menu
menu.appendChild(saveButton);
menu.appendChild(loadButton);
menu.appendChild(fileInput);

    function addUser(newUsername) {
    const newUserLink = document.createElement('a');
    newUserLink.href = "#";
    newUserLink.dataset.username = newUsername;
    newUserLink.textContent = `@${newUsername}`;
    newUserLink.addEventListener('click', switchUser);
    userLinks.insertBefore(newUserLink, addUserLink);
    likedTweets[newUsername] = {}; // Initialize likedTweets for the new user
}

    tweetButton.addEventListener('click', () => toggleModal('flex'));
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            toggleModal('none');
        }
    });
    sendTweetButton.addEventListener('click', handleTweetSubmit);
    menu.addEventListener('click', toggleDropdownDisplay);
    addUserLink.addEventListener('click', addUser);
    userLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', switchUser));

    // Auto-like functionality
    function simulateAutoLike() {
        const allTweets = Array.from(document.querySelectorAll('.tweet'));
        allTweets.forEach(tweet => autoLike(tweet));
        setTimeout(simulateAutoLike, 5000); // Adjust the time interval as needed (in milliseconds)
    }

    function autoLike(tweet) {
        const tweetId = tweet.getAttribute('id');
        const users = Array.from(userLinks.querySelectorAll('a')).map(link => link.dataset.username);

        users.forEach(username => {
            if (username !== activeUser && Math.random() < 0.2) {
                if (!likedTweets[tweetId][username]) {
                    likedTweets[tweetId][username] = true;
                    updateLikes(tweetId, tweet);
                }
            }
        });
    }

    simulateAutoLike();


    


	function getRandomTweet() {
		return randomTweets[Math.floor(Math.random() * randomTweets.length)];
	}

	function getSpecialTweet(username) {
		if (!username) {
			return null; // Handle the case where username is not defined
		}

		const specialTweet = specialTweets.find(tweet => tweet.username === username);
		
		if (!specialTweet) {
			return null;
		}
		
		let startIndex, endIndex;
		
		if (username === "Millet") {
			startIndex = 1;
			endIndex = 50;
		} else if (username === "IU") {
			startIndex = 51;
			endIndex = 100;
		}
		
		const availableImageIndices = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => i + startIndex)
			.filter(index => !usedImageIndices[username]?.includes(index)); // Add a check for undefined
		
		if (availableImageIndices.length === 0) {
			return null; // No available images left for this user
		}
		
		const randomImageIndex = availableImageIndices[Math.floor(Math.random() * availableImageIndices.length)];
		usedImageIndices[username].push(randomImageIndex);
		
		return {
			text: specialTweet.text,
			image: `foto/${randomImageIndex}.jpg`,
			profileImage: specialTweet.profileImage,
			username: specialTweet.username,
			isVerified: specialTweet.isVerified,
			chance: specialTweet.chance
		};
	}

	function simulateRandomTweetPost() {
		const users = Array.from(userLinks.querySelectorAll('a')).map(link => link.dataset.username);

		users.forEach(username => {
			if (username !== activeUser) {
				let tweetObj = getSpecialTweet(username);

				if (!tweetObj) {
					tweetObj = getRandomTweet();
				}
				
				if (Math.random() < tweetObj.chance) {
					const newTweet = createTweetElement(tweetObj.text, tweetObj.image, username, tweetObj.isVerified);
					mainContent.insertBefore(newTweet, mainContent.firstChild);
				}
			}
		});

		setTimeout(simulateRandomTweetPost, 15000); // Adjust the interval as needed (in milliseconds)
	}

	simulateRandomTweetPost()


});