import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeConfiguredStore } from '../../app/store';
import { monthlyBudgetPlainActions } from '../monthly-budget/monthlyBudgetDuck';
import EmergencySimulator from './EmergencySimulator';

describe('emergency saving simulator', () => {
  it('should simulate emergency saving', () => {
    const store = makeConfiguredStore();
    store.dispatch(
      monthlyBudgetPlainActions.setRead(null, [
        {
          rememberOnDashboard: true,
          month: 11,
          amount: '10000.00',
          category: '',
          project: 'KO4nF9EDng0XEYI1KeOT',
          year: 2021,
          name: 'salario',
          type: 'income',
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          uuid: 'VQlo3e4frBJbUwpF4Fys',
        },
        {
          project: 'KO4nF9EDng0XEYI1KeOT',
          rememberOnDashboard: true,
          category: '',
          month: 11,
          amount: '2000.00',
          name: 'nubank',
          year: 2021,
          userUid: 'NcxuU13pLHMsTPqoHSKYSL03PRb2',
          type: 'expense',
          uuid: 'WrEFWVWN0MtIxmbDavaH',
        },
      ])
    );
    const container = render(
      <Provider store={store}>
        <EmergencySimulator />
      </Provider>
    );

    expect(container.getByTestId('objectiveId').textContent).toBe('6.000,00');
  });
});
