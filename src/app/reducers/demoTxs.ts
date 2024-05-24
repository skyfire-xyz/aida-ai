const txs = [
  {
    id: "b5c45ce6-47d1-49a0-9a33-2e670bb7cd2e",
    txId: "c18b50b4-0166-479e-a401-d1d229c4c2fc",
    txType: "PAYMENT_REDEMPTION",
    status: "WAITING_CONFIRMATION",
    txHash:
      "0x90d2f924e189758b5ab8e6d2f77fe27acda41532b9e8fc3c2f3b61a34d7cb5d7",
    createdAt: "2024-04-24T19:13:07.705Z",
    type: "REDEMPTION",
    redemption: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540",
      destinationName: "HumorAI",
      amounts: { currency: "USDC", fee: "0", subtotal: "0", total: "0" },
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    redemptionId: "b5c45ce6-47d1-49a0-9a33-2e670bb7cd2e",
  },
  {
    id: "4da78d0a-adc5-44ce-bfc9-40e78182c973",
    txId: "dfde5819-fc7a-423a-8571-d3550bd81975",
    txType: "PAYMENT_CLAIM",
    status: "WAITING_CONFIRMATION",
    txHash: "4B7A70C4049C02149F47E3353AC31F2838FE2CA4BB33633F72CD5806314BB95A",
    createdAt: "2024-04-24T19:13:06.373Z",
    type: "CLAIM",
    claim: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540",
      destinationName: "HumorAI",
      value: "295832",
      currency: "USDC",
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    claimId: "4da78d0a-adc5-44ce-bfc9-40e78182c973",
  },
  {
    id: "e957300d-53f0-478c-90b5-d183c8c17563",
    txId: "1e7d200d-606d-4705-be46-fa99a74ba34b",
    txType: "PAYMENT_REDEMPTION",
    status: "SUCCESS",
    txHash:
      "0xcfaf5a5527005a1ab5e2aa9ce51dff159ee3f60efb42b0edbb14783f1076e21b",
    createdAt: "2024-04-24T19:07:43.383Z",
    type: "REDEMPTION",
    redemption: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540",
      destinationName: "HumorAI",
      amounts: {
        currency: "USDC",
        fee: "295",
        subtotal: "2663",
        total: "2958",
      },
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    redemptionId: "e957300d-53f0-478c-90b5-d183c8c17563",
  },
  {
    id: "c2e2d85c-f7f5-46ee-95d6-0d8f2eb10589",
    txId: "4450da35-5c98-4b64-a754-fc40bc4d6b17",
    txType: "PAYMENT_CLAIM",
    status: "SUCCESS",
    txHash: "28A531D5936FD3881A45CB02B79EEAD77C62D72898C6E56D21CE4925E90E3E1E",
    createdAt: "2024-04-24T19:07:40.868Z",
    type: "CLAIM",
    claim: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540",
      destinationName: "HumorAI",
      value: "2958",
      currency: "USDC",
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    claimId: "c2e2d85c-f7f5-46ee-95d6-0d8f2eb10589",
  },
  {
    id: "94fa60a4-6c67-44bc-b39b-e03863c568bd",
    txId: "f558798a-1588-4c9e-ba2e-58e5970e3b9d",
    txType: "PAYMENT_REDEMPTION",
    status: "SUCCESS",
    txHash:
      "0xcd697e4d3058acf7817173f80ccda5eaab2480358313225e352530ab6b32b41c",
    createdAt: "2024-04-24T16:11:03.349Z",
    type: "REDEMPTION",
    redemption: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540",
      destinationName: "HumorAI",
      amounts: {
        currency: "USDC",
        fee: "295",
        subtotal: "2663",
        total: "2958",
      },
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    redemptionId: "94fa60a4-6c67-44bc-b39b-e03863c568bd",
  },
  {
    id: "cf66ae50-ef6b-4724-a87e-70589272312d",
    txId: "56c3c4db-5638-42ec-827a-5c2637e5279f",
    txType: "PAYMENT_CLAIM",
    status: "SUCCESS",
    txHash: "381E316FCD3C69E67CCFD35B605A24BCFEBDE789819954C5D6F23111176C0ED6",
    createdAt: "2024-04-24T16:11:01.179Z",
    type: "CLAIM",
    claim: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540",
      destinationName: "HumorAI",
      value: "2958",
      currency: "USDC",
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    claimId: "cf66ae50-ef6b-4724-a87e-70589272312d",
  },
  {
    id: "5ec00bef-b493-4322-9a0b-c1c9f18707c5",
    txId: "545cb92a-aa14-4490-a4b6-3a8c8bc02723",
    txType: "POLYGON_USDC_PAYMENT",
    status: "SUCCESS",
    txHash:
      "0x9e7abec1597401f81b6a359c97ab413f0308c2c90030389d1a729f0a356feb27",
    createdAt: "2024-04-24T15:35:09.633Z",
    type: "PAYMENT",
    payment: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0x4E3E0feD99e56d29492e44C176faB18B20aCCC57",
      destinationName: "Perplexity",
      value: "2534",
      currency: "USDC",
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    paymentId: "5ec00bef-b493-4322-9a0b-c1c9f18707c5",
  },
  {
    id: "d8f5d3da-a9e3-4424-94a1-bcc19b2d2d32",
    txId: "5d411542-17de-45ec-9dce-b67b0bded09b",
    txType: "POLYGON_USDC_PAYMENT",
    status: "SUCCESS",
    txHash:
      "0x9fb6e7546d475b614e09f7bb60869f0a1f4ce7f32677feed5b227570fc533682",
    createdAt: "2024-04-24T15:11:51.532Z",
    type: "PAYMENT",
    payment: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540",
      destinationName: "HumorAI",
      value: "2958",
      currency: "USDC",
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    paymentId: "d8f5d3da-a9e3-4424-94a1-bcc19b2d2d32",
  },
  {
    id: "77cfbd3c-2ea2-4a55-a555-c38cf99400cf",
    txId: "fdb71c9d-b6ff-47ce-85d6-34036167919c",
    txType: "POLYGON_USDC_PAYMENT",
    status: "SUCCESS",
    txHash:
      "0x66e77b8944f3ee591f2610c9ff831dbe18a0b39cc68eb8c0d731e6b64213adaf",
    createdAt: "2024-04-24T15:11:50.182Z",
    type: "PAYMENT",
    payment: {
      sourceAddress: "0x45c83889BD84D5FB77039B67C30695878f506313",
      sourceName: "Supermojo Demo",
      destinationAddress: "0xB23338A0F7999e322a504915590ca6A2f0fB2d90",
      destinationName: "KaggleAI",
      value: "32125",
      currency: "USDC",
    },
    userId: "7a171a1f-70e0-4227-9481-19073a768673",
    paymentId: "77cfbd3c-2ea2-4a55-a555-c38cf99400cf",
  },
];

export default txs;