async function loadContacts() {
  const response = await fetch('contacts/index.json');
  const contactList = await response.json();
  const container = document.getElementById('contactList');

  container.innerHTML = contactList.map(c => `
    <div class="border-b py-2">
      <strong>${c.prenom} ${c.nom}</strong> – ${c.email} – ${c.telephone}<br>
      <a href="view.html?id=${c.id}" class="text-blue-600 underline" target="_blank">Voir fiche</a>
    </div>
  `).join('');
}

document.getElementById('loadContacts').addEventListener('click', loadContacts);

document.getElementById('uploadContact').addEventListener('click', async () => {
  const fileInput = document.getElementById('contactFile');
  const file = fileInput.files[0];
  if (!file) return alert('Aucun fichier sélectionné.');

  const content = await file.text();
  const filename = `contacts/contact_${Date.now()}.json`;
  const token = prompt("Entre ton token GitHub personnel (repo access):");

  await fetch(`https://api.github.com/repos/Qualitech-conseil/NFC_Contact_Card/contents/${filename}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Ajout auto depuis admin.html`,
      content: btoa(unescape(encodeURIComponent(content)))
    })
  });

  alert('Contact envoyé. Le GitHub Action mettra à jour l\'index dans 1 minute.');
});
