import reducer, { INITIAL_STATE } from '~/store/modules/auth/reducer';
import * as Auth from '~/store/modules/auth/actions';

describe('Auth reducer', () => {
  it('DEFAULT', () => {
    const state = reducer(undefined, {});

    expect(state).toHaveProperty('loading', false);
    expect(state).toHaveProperty('signed', false);
  });

  it('SIGN_IN_REQUEST', () => {
    const state = reducer(
      INITIAL_STATE,
      Auth.signInRequest('hugomarcelo@lg.com.br', '123456')
    );

    expect(state).toHaveProperty('loading', true);
  });
});
