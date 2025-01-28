export const getAllColors = () => {
  return [
    { name: 'Bright Blue', value: '#007AFF' },
    { name: 'Teal Green', value: '#00C689' },
    { name: 'Sunset Orange', value: '#FF7043' },
    { name: 'Cool Gray', value: '#5F738E' },
    { name: 'Blush Pink', value: '#FF6F91' },
    { name: 'Lush Green', value: '#4CAF50' },
    { name: 'Vivid Purple', value: '#9C27B0' },
    { name: 'Golden Yellow', value: '#FFC107' },
    { name: 'Sky Blue', value: '#42A5F5' },
    { name: 'Electric Cyan', value: '#00E5FF' },
  ];
};

export const getRandomColor = () => {
  const colors = getAllColors();
  return colors[Math.floor(Math.random() * colors.length)].value;
};
