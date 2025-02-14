import { makeReduxAssets } from 'resource-toolkit';
import {
  makeFirestoreApiClient,
  makeFirstDateOfMonth,
  makeLastDateOfMonth,
  parseQuerySnapshot,
} from '../../app/firebase-adapters';
import makeResourceMessageTextFn from '../izitoast-for-resources/makeResourceMessageTextFn';

const client = makeFirestoreApiClient('transactions');

const transactionsResource = makeReduxAssets({
  name: 'transactions',
  idKey: 'uuid',
  makeMessageText: makeResourceMessageTextFn('transação', 'transações'),
  gateway: {
    fetchMany: (ids, basicData) =>
      client
        .query(basicData)
        .where('datetime', '>=', makeFirstDateOfMonth(basicData.month, basicData.year))
        .where('datetime', '<=', makeLastDateOfMonth(basicData.month, basicData.year))
        .get()
        .then(parseQuerySnapshot),
    create: (transaction, basicData) => client.create(basicData, transaction),
    delete: (uuid) => client.delete(uuid),
  },
});

export const { actionThunks: transactionsActions, plainActions: monthlyTransactionsPlainActions } =
  transactionsResource;

export default transactionsResource.reducer;
