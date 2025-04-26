import { act } from '@testing-library/react-native';
import { useAuthStore } from '../authStore';

describe('authStore', () => {
  afterEach(() => {
    // Очистка состояния после каждого теста
    useAuthStore.setState({ role: null, username: null, token: null });
  });

  it('устанавливает роль, имя пользователя и токен', () => {
    act(() => {
      useAuthStore.getState().setAuth({
        role: 'client',
        username: 'testuser',
        token: '12345token',
      });
    });

    const state = useAuthStore.getState();

    expect(state.role).toBe('client');
    expect(state.username).toBe('testuser');
    expect(state.token).toBe('12345token');
  });

  it('обнуляет данные при logout', () => {
    // Сначала зададим данные
    act(() => {
      useAuthStore.getState().setAuth({
        role: 'client',
        username: 'testuser',
        token: '12345token',
      });
    });

    // Теперь разлогиним
    act(() => {
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();

    expect(state.role).toBeNull();
    expect(state.username).toBeNull();
    expect(state.token).toBeNull();
  });
});
