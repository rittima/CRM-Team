import React from 'react';

const ContactCard = ({ contact }) => {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{contact.name}</h2>
      <p>Email: {contact.email}</p>
      <p>Phone: {contact.phone}</p>
    </div>
  );
};

export default ContactCard;