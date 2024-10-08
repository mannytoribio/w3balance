export interface TokenPrice {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
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
    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }

    const { data } = (await response.json()) as {
      data: { [key: string]: TokenPrice };
    };
    return Object.values(data);
  } catch (error) {
    console.error('Error fetching token prices', error);
    throw error;
  }
};
