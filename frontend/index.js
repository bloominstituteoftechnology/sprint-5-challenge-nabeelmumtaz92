async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇

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

  document.addEventListener('click', function(event) {
    // Check if the click was outside of a '.card' element
    if (!event.target.closest('.card')) {
      // Find any currently selected cards
      const selectedCards = document.querySelectorAll('.card.selected');
      selectedCards.forEach(card => {
        // Remove the 'selected' class
        card.classList.remove('selected');
        // Hide the mentors list
        card.querySelector('ul').style.display = 'none';
      });
      // Optionally, update the info paragraph to indicate no learner is selected
      const infoParagraph = document.querySelector('.info');
      if (infoParagraph) {
        infoParagraph.textContent = 'No learner is selected';
      }
    }
  });

  // Map mentors' IDs to their names
  const mentorMap = mentorsData.reduce((acc, mentor) => {
    let fullName = mentor.firstName + " " + mentor.lastName;
    acc[mentor.id] = fullName;
    return acc;
  }, {});

  // Transform learners to include mentor names instead of IDs
  const transformedLearners = learnersData.map(learner => ({
    ...learner,
    mentors: learner.mentors.map(id => mentorMap[id])
  }));

  // Function to create a learner card
  function createLearnerCard(learner, mentorMap) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${learner.fullName}</h3>
      <div>${learner.email}</div>
      <h4>Mentors</h4>
      <ul style="display: none;">${learner.mentors.map(name => `<li>${name}</li>`).join('')}</ul>
    `;
    return card;
  }

  // Render learner cards
  const cardsContainer = document.querySelector('.cards');
  transformedLearners.forEach(learner => {
    const card = createLearnerCard(learner, mentorMap);
    card.addEventListener('click', function() {
      // Deselect other cards and hide their mentors list
      document.querySelectorAll('.card.selected').forEach(selectedCard => {
        selectedCard.classList.remove('selected');
        selectedCard.querySelector('ul').style.display = 'none';
      });
      // Toggle selection of the current card and show/hide its mentors list
      this.classList.toggle('selected');
      this.querySelector('ul').style.display = this.classList.contains('selected') ? 'block' : 'none';
      // Update info paragraph based on selection
      const infoParagraph = document.querySelector('.info');
      infoParagraph.textContent = this.classList.contains('selected') ? `The selected learner is ${learner.fullName}` : 'No learner is selected';
    });
    cardsContainer.appendChild(card);
  });

  // Set footer text with current year
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `©️ BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;
}

// Ensure everything is loaded before running the script
document.addEventListener('DOMContentLoaded', loadData);

  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
