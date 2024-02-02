async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇

/// Assuming axios is globally available

// Function to fetch data from an endpoint
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Main function to load and display data
async function loadData() {
  const learnersData = await fetchData('http://localhost:3003/api/learners');
  const mentorsData = await fetchData('http://localhost:3003/api/mentors');

  // Map mentors' IDs to their names
  const mentorMap = mentorsData.reduce((acc, mentor) => {
    acc[mentor.id] = mentor.firstName + " " + mentor.lastName;
    return acc;
  }, {});

  // Transform learners to include mentor names instead of IDs
  const transformedLearners = learnersData.map(learner => ({
    ...learner,
    mentors: learner.mentors.map(id => mentorMap[id])
  }));

  const cardsContainer = document.querySelector('.cards');
  transformedLearners.forEach(learner => {
    const card = createLearnerCard(learner);
    cardsContainer.appendChild(card);
  });

  // Update the info paragraph once all cards are loaded
  const infoParagraph = document.querySelector('.info');
  if (infoParagraph) {
    infoParagraph.textContent = 'No learner is selected';
  }

  // Deselect cards when clicking outside of them
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.card')) {
      deselectAllCards();
      if (infoParagraph) {
        infoParagraph.textContent = 'No learner is selected';
      }
    }
  });
}

function deselectAllCards() {
  document.querySelectorAll('.card.selected').forEach(card => {
    card.classList.remove('selected');
    card.querySelector('ul').style.display = 'none';
  });
}

function createLearnerCard(learner) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3>${learner.fullName}</h3> <!-- ID will be conditionally displayed -->
    <div>${learner.email}</div>
    <h4 class="mentors-header">&#9658; Mentors</h4> <!-- Arrow points right initially, placed to the left -->
    <ul style="display: none;">${learner.mentors.map(name => `<li>${name}</li>`).join('')}</ul>
  `;

  // Toggle mentors list and arrow direction
  card.querySelector('.mentors-header').addEventListener('click', function(event) {
    event.stopPropagation();
    const ul = this.nextElementSibling;
    const isListVisible = ul.style.display === 'block';
    ul.style.display = isListVisible ? 'none' : 'block';
    this.innerHTML = isListVisible ? '&#9658; Mentors' : '&#9660; Mentors'; // Update arrow direction
  });

  // Handle card selection/deselection
  card.addEventListener('click', function(event) {
    event.stopPropagation();
    const previouslySelectedCard = document.querySelector('.card.selected');
    // If there's a previously selected card and it's not the current card, deselect it
    if (previouslySelectedCard && previouslySelectedCard !== this) {
      previouslySelectedCard.classList.remove('selected');
      previouslySelectedCard.querySelector('ul').style.display = 'none';
      previouslySelectedCard.querySelector('.mentors-header').innerHTML = '&#9658; Mentors'; // Reset arrow
      previouslySelectedCard.querySelector('h3').textContent = previouslySelectedCard.querySelector('h3').textContent.replace(/, ID \d+/, ''); // Remove ID for other cards
    }

    // Toggle current card's selection state
    const isSelected = this.classList.toggle('selected');
    const h3 = this.querySelector('h3');
    if (isSelected) {
      h3.textContent = `${learner.fullName}, ID ${learner.id}`; // Show ID
    } else {
      h3.textContent = `${learner.fullName}`; // Hide ID
      this.querySelector('ul').style.display = 'none'; // Hide mentors list
      this.querySelector('.mentors-header').innerHTML = '&#9658; Mentors'; // Reset arrow
    }

    // Update info paragraph based on selection
    const infoParagraph = document.querySelector('.info');
    if (infoParagraph) {
      infoParagraph.textContent = isSelected ? `The selected learner is ${learner.fullName}` : 'No learner is selected';
    }
  });

  return card;
}


// Ensure everything is loaded before running the script
document.addEventListener('DOMContentLoaded', loadData);
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
