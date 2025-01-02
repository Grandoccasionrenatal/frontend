import { BASE_URL, COMMON_HEADER } from '..';

const getHeroStatistic = async (params?: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/hero-section-statistics?${params}`);
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

const getBanners = async (params?: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/banners?${params}`);
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

const getAdvertisements = async (params?: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/advertisements?${params}`);
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};



const getReviews = async () => {

  try {
    const res = await fetch(`${BASE_URL}/api/reviews`)
    return res.json()
  } catch (err) {
    console.log('err', err)
  }
}

const otherServices = { getBanners, getHeroStatistic, getAdvertisements, getReviews };

export default otherServices;
