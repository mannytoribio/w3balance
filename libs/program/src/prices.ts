export interface TokenPrice {
  id: string;
  price: number;
}

export const fetchTokenPrices = async (
  tokenIds: string[],
  vsToken: string
): Promise<TokenPrice[]> => {
  try {
    const ids = tokenIds.join(',');
    const response = await fetch(
      `https://price.jup.ag/v4/price?ids=${ids}&vsToken=${vsToken}`,
      {
        method: 'GET',
      }
    );
    console.log('response', response);
    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }

    const data: TokenPrice[] = await response.json();
    console.log('TokenPrice data', data);
    return data;
  } catch (error) {
    console.error('Error fetching token prices', error);
    throw error;
  }
};
