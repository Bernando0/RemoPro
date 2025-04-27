// AppNavigator.test.js

import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import AppNavigator from '../AppNavigator';

// Мокаем здесь!
jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

describe('AppNavigator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('показывает экран Login, если роль не установлена', () => {
    useAuthStore.mockReturnValue(null);

    const { getByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    expect(getByText('Войти')).toBeTruthy();
  });

  it('показывает клиентскую навигацию, если роль ROLE_CLIENT', () => {
    useAuthStore.mockReturnValue('ROLE_CLIENT');

    const { getByTestId } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    expect(getByTestId('client-tabs')).toBeTruthy();
  });

  it('показывает навигацию подрядчика, если роль ROLE_CONTRACTOR', () => {
    useAuthStore.mockReturnValue('ROLE_CONTRACTOR');

    const { getByTestId } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    expect(getByTestId('contractor-tabs')).toBeTruthy();
  });
});
