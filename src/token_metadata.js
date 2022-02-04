import { Account } from "@metaplex-foundation/mpl-core";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection } from "@metaplex/js";

const connection = new Connection("mainnet-beta");

export async function getMetadata(tokenAddress) {
  const metadataPDA = await Metadata.getPDA(tokenAddress);
  const mintAccInfo = await connection.getAccountInfo(metadataPDA);

  return Metadata.from(new Account(tokenAddress, mintAccInfo));
}
