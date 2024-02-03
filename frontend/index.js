async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  {
    async function fetchData(url) {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    }
  
    async function loadData() {
      const learnersData = await fetchData('http://localhost:3003/api/learners');
      const mentorsData = await fetchData('http://localhost:3003/api/mentors');
  
      const mentorMap = mentorsData.reduce((acc, mentor) => {
        acc[mentor.id] = mentor.firstName + " " + mentor.lastName;
        return acc;
      }, {});
  
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
    }
  
    function createLearnerCard(learner) {
      const card = document.createElement('div');
      card.className = 'card';
  
      const name = document.createElement('h3');
      name.textContent = learner.fullName; // Initially, don't show ID
      card.appendChild(name);
  
      const email = document.createElement('div');
      email.textContent = learner.email;
      card.appendChild(email);
  
      const mentorsHeader = document.createElement('h4');
      mentorsHeader.className = 'mentors-header';
  
      const arrow = document.createElement('span');
      arrow.textContent = '►';
      mentorsHeader.appendChild(arrow);
  
      const mentorsText = document.createElement('span');
      mentorsText.textContent = ' Mentors';
      mentorsHeader.appendChild(mentorsText);
  
      card.appendChild(mentorsHeader);
  
      const mentorsList = document.createElement('ul');
      mentorsList.style.display = 'none';
      learner.mentors.forEach(mentorName => {
        const mentorItem = document.createElement('li');
        mentorItem.textContent = mentorName;
        mentorsList.appendChild(mentorItem);
      });
      card.appendChild(mentorsList);
  
      mentorsHeader.addEventListener('click', function(event) {
        event.stopPropagation();
        mentorsList.style.display = mentorsList.style.display === 'block' ? 'none' : 'block';
        arrow.textContent = mentorsList.style.display === 'block' ? '▼' : '►';
      });
  
      card.addEventListener('click', function(event) {
        event.stopPropagation();
        // Deselect all other selected cards first
        document.querySelectorAll('.card.selected').forEach(selectedCard => {
          if (selectedCard !== card) {
            selectedCard.classList.remove('selected');
            selectedCard.querySelector('h3').textContent = selectedCard.querySelector('h3').textContent.replace(/, ID \d+/, '');
            selectedCard.querySelector('ul').style.display = 'none';
            selectedCard.querySelector('.mentors-header').childNodes[0].textContent = '►'; // Reset arrow
          }
        });
  
        const isSelected = card.classList.toggle('selected');
        const infoParagraph = document.querySelector('.info');
        if (isSelected) {
          name.textContent = `${learner.fullName}, ID ${learner.id}`;
          if (infoParagraph) {
            infoParagraph.textContent = `The selected learner is ${learner.fullName}`;
          }
        } else {
          if (infoParagraph) {
            infoParagraph.textContent = 'No learner is selected';
          }
        }
      });
  
      return card;
    }
  
    document.addEventListener('DOMContentLoaded', loadData);
  }
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
