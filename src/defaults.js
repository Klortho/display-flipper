const fam = dName => dName.substr(0, 1);

export default {
  duration: 100,
  width: 20,
  height: 40,
  color: '#333',
  textColor: 'white',
  font: 'helvetica',
  fontSize: 25,
  padding: 1,
  shrinkToFit: true,
  gap: (d0, d1) => fam(d0) === fam(d1) ? 1 : 3,
};
