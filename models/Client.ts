const mongoose = require('mongoose')

// const Schema = mongoose.Schema;

const Client = mongoose.model('Client', {
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  cpf: { type: String, required: true },
});

// const Client = mongoose.model('Client', clientSchema);

export default Client;