import axios from 'axios';

let tbody = document.querySelector('#tbody');
let saveContact = document.getElementById('saveContact');

// server url
const BASE_URL = 'http://localhost:3000/contents/';

// create TdEliment function

const creatTDEliment = (content, parentElement) => {
	const TR = document.createElement('tr');

	const tdName = document.createElement('td');
	tdName.innerHTML = content.name;
	TR.appendChild(tdName);

	const tdPhone = document.createElement('td');
	tdPhone.innerHTML = content.phone ? content.phone : 'N/A';
	TR.appendChild(tdPhone);

	const tdEmail = document.createElement('td');
	tdEmail.innerHTML = content.email ? content.email : 'N/A';
	TR.appendChild(tdEmail);

	const tdAction = document.createElement('td');

	// Edit Contatct
	const tdEditBtn = document.createElement('button');
	tdEditBtn.innerHTML = 'Edit';
	tdEditBtn.className = 'btn btn-warning mx-1';
	tdEditBtn.addEventListener('click', () => {
		//Jquery For B4- Modal
		$('#contactEditModal').modal('toggle');

		let editName = document.querySelector('#edit-name');
		let editPhone = document.querySelector('#edit-phone');
		let editEmail = document.querySelector('#edit-email');

		editName.value = content.name;
		editPhone.value = content.phone ? content.phone : '';
		editEmail.value = content.email ? content.email : '';

		//update contact
		let updateContact = document.querySelector('#updateContact');
		updateContact.addEventListener('click', () => {
			axios
				.put(`${BASE_URL}/${content.id}`, {
					name: editName.value,
					email: editEmail.value,
					phone: editPhone.value,
				})
				.then((res) => {
					tdName.innerHTML = res.data.name;
					tdPhone.innerHTML = res.data.phone;
					tdEmail.innerHTML = res.data.email;
					// Hide modal
					$('#contactEditModal').modal('hide');
				})
				.catch((err) => console.log(err));
		});
	});
	tdAction.appendChild(tdEditBtn);

	// Delete contact
	const tdDeleteBtn = document.createElement('button');
	tdDeleteBtn.innerHTML = 'Delete';
	tdDeleteBtn.className = 'btn btn-danger mx-1';
	tdDeleteBtn.addEventListener('click', () => {
		axios
			.delete(`${BASE_URL}/${content.id}`)
			.then((res) => {
				parentElement.removeChild(TR);
			})
			.catch((err) => console.log(err));
	});
	tdAction.appendChild(tdDeleteBtn);

	TR.appendChild(tdAction);

	parentElement.appendChild(TR);
};

// create new contant function
const createNewContent = () => {
	let nameField = document.getElementById('nameField');
	let phoneField = document.getElementById('phoneField');
	let emailField = document.getElementById('emailField');

	let contant = {
		name: nameField.value,
		phone: phoneField.value,
		email: emailField.value,
	};

	axios
		.post(BASE_URL, contant)
		.then((res) => {
			creatTDEliment(res.data, tbody);

			nameField.value = '';
			phoneField.value = '';
			emailField.value = '';
		})
		.then((err) => console.log(err));
};

//Load Data from server
window.onload = () => {
	axios
		.get(BASE_URL)
		.then((res) => {
			res.data.forEach((content) => {
				creatTDEliment(content, tbody);
			});
		})
		.then((err) => {
			console.log(err);
		});
};
//save new contact
saveContact.addEventListener('click', () => {
	createNewContent();
});
