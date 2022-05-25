export const fetchPhotos = (name, page) => {
  const objParams = new URLSearchParams({
    key: '27639278-974e1c7751522d3c9b2b4743f',
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: '40',
    page: page,
  });

  let searchParams = '';
  objParams.forEach((value, name) => {
    searchParams += `${name}=${value}&`;
  });

  return fetch(`https://pixabay.com/api/?${searchParams}`).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.status);
    }
    return responce.json();
  });
};
