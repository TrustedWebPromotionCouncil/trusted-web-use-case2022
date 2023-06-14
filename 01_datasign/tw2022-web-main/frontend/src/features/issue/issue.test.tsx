/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Issue from './Issue';
const setup = (jsx: JSX.Element): any => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    user: userEvent.setup(),
    ...render(jsx),
  };
};
describe('test Issue Originator Profile', () => {
  it('default state', () => {
    render(<Issue />);

    expect(screen.getAllByRole('textbox')).toHaveLength(8);

    expect(screen.getByTestId('url')).toBeEmptyDOMElement();
    expect(screen.getByTestId('name')).toBeEmptyDOMElement();
    expect(screen.getByTestId('postalCode')).toBeEmptyDOMElement();
    expect(screen.getByTestId('addressCountry')).toBeEmptyDOMElement();
    expect(screen.getByTestId('addressRegion')).toBeEmptyDOMElement();
    expect(screen.getByTestId('addressLocality')).toBeEmptyDOMElement();
    expect(screen.getByTestId('streetAddress')).toBeEmptyDOMElement();
    expect(screen.getByTestId('expire')).toBeEmptyDOMElement();
    expect(screen.getByTestId('expire')).toHaveValue('365');

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(9);

    expect(screen.getByLabelText('広告会社')).not.toBeChecked();
    expect(screen.getByLabelText('広告主')).not.toBeChecked();
    expect(screen.getByLabelText('DSP事業者')).not.toBeChecked();
    expect(screen.getByLabelText('SSP事業者')).not.toBeChecked();
    expect(screen.getByLabelText('アドネットワーク事業者')).not.toBeChecked();
    expect(screen.getByLabelText('アドエクスチェンジ事業者')).not.toBeChecked();
    expect(screen.getByLabelText('媒体事業者')).not.toBeChecked();
    expect(screen.getByLabelText('アドベリツールベンダー')).not.toBeChecked();
    expect(screen.getByLabelText('アクセス解析事業者')).not.toBeChecked();

    expect(screen.getByText('OP登録')).toBeDisabled();
  });

  it('input value', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { user } = setup(<Issue />);
    const submitButton = screen.getByText('OP登録');
    expect(screen.getByText('OP登録')).toBeDisabled();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.type(screen.getByTestId('url'), 'https://test.com/');
    await waitFor(() => {
      expect(screen.getByText('会社名を入力してください')).toBeTruthy();
      expect(screen.getByText('郵便番号を入力してください')).toBeTruthy();
      expect(screen.getByText('国名を入力してください')).toBeTruthy();
      expect(screen.getByText('都道府県を入力してください')).toBeTruthy();
      expect(screen.getByText('市区町村を入力してください')).toBeTruthy();
      expect(screen.getByText('番地号・建物名を入力してください')).toBeTruthy();
      expect(screen.getByText('事業形態にチェック入れてください')).toBeTruthy();
      expect(submitButton).toBeDisabled();
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.type(screen.getByTestId('name'), 'DataSign Inc.');
    await waitFor(() => {
      expect(screen.getByText('郵便番号を入力してください')).toBeTruthy();
      expect(screen.getByText('国名を入力してください')).toBeTruthy();
      expect(screen.getByText('都道府県を入力してください')).toBeTruthy();
      expect(screen.getByText('市区町村を入力してください')).toBeTruthy();
      expect(screen.getByText('番地号・建物名を入力してください')).toBeTruthy();
      expect(screen.getByText('事業形態にチェック入れてください')).toBeTruthy();
      expect(submitButton).toBeDisabled();
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.type(screen.getByTestId('postalCode'), '111-1111');
    await waitFor(() => {
      expect(screen.getByText('国名を入力してください')).toBeTruthy();
      expect(screen.getByText('都道府県を入力してください')).toBeTruthy();
      expect(screen.getByText('市区町村を入力してください')).toBeTruthy();
      expect(screen.getByText('番地号・建物名を入力してください')).toBeTruthy();
      expect(screen.getByText('事業形態にチェック入れてください')).toBeTruthy();
      expect(submitButton).toBeDisabled();
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.type(screen.getByTestId('addressCountry'), 'JP');
    await waitFor(() => {
      expect(screen.getByText('都道府県を入力してください')).toBeTruthy();
      expect(screen.getByText('市区町村を入力してください')).toBeTruthy();
      expect(screen.getByText('番地号・建物名を入力してください')).toBeTruthy();
      expect(screen.getByText('事業形態にチェック入れてください')).toBeTruthy();
      expect(submitButton).toBeDisabled();
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.type(screen.getByTestId('addressRegion'), 'Tokyo');
    await waitFor(() => {
      expect(screen.getByText('市区町村を入力してください')).toBeTruthy();
      expect(screen.getByText('番地号・建物名を入力してください')).toBeTruthy();
      expect(screen.getByText('事業形態にチェック入れてください')).toBeTruthy();
      expect(submitButton).toBeDisabled();
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.type(screen.getByTestId('addressLocality'), 'Shibuya');
    await waitFor(() => {
      expect(screen.getByText('番地号・建物名を入力してください')).toBeTruthy();
      expect(screen.getByText('事業形態にチェック入れてください')).toBeTruthy();
      expect(submitButton).toBeDisabled();
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.type(screen.getByTestId('streetAddress'), '1-1-1');
    await waitFor(() => {
      expect(screen.getByText('事業形態にチェック入れてください')).toBeTruthy();
      expect(submitButton).toBeDisabled();
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await user.click(screen.getByLabelText('アクセス解析事業者'));
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
