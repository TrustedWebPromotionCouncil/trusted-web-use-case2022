import apiClient from '../../shered/apiClient';

interface onSubmitValues {
  url: string;
  name: string;
  postalCode: string;
  addressCountry: string;
  addressRegion: string;
  addressLocality: string;
  streetAddress: string;
  businessCategory: string;
  expire: string;
}
export const issueAsyncProcess = async (values: onSubmitValues): Promise<boolean> => {
  const holderProfile = {
    url: values.url,
    name: values.name,
    postalCode: values.postalCode,
    addressCountry: values.addressCountry,
    addressRegion: values.addressRegion,
    addressLocality: values.addressLocality,
    streetAddress: values.streetAddress,
    businessCategory: [values.businessCategory],
  };
  const payload = {
    holderProfile,
    expire: Number(values.expire) !== 0 ? Number(values.expire) : 365,
  };
  console.log('payload', payload);
  try {
    // eslint-disable-next-line @typescript-eslint/ban-types
    await apiClient.post<{}>(`/api/3rd-party/op`, payload);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default issueAsyncProcess;
