import { mount } from '@vue/test-utils';
import IDForm from '@/components/IDForm.vue';
import axios from 'axios';

describe('IDForm', () => {
  it('handles the scenario when no logs are found', async () => {
    // Mock the axios.get method to return an empty result
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: [],
    });

    // Create a wrapper for the IDForm component
    const wrapper = mount(IDForm);

    // Set the correlation ID in the input field
    const correlationIdInput = wrapper.find('input[type="text"]');
    correlationIdInput.setValue('12345');

    // Simulate form submission
    const form = wrapper.find('form');
    await form.trigger('submit');

    // Assert that the axios.get method was called with the correct parameters
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/search-logs/', {
      params: { id: '12345' },
    });

    // Assert that an error message is displayed in the UI
    const errorMessage = wrapper.find('.errorMessage');
    expect(errorMessage.text()).toBe('No logs found with LogCorrelationId 12345');

    // Assert that no log blocks are displayed in the UI
    const logBlocks = wrapper.findAll('.log-block');
    expect(logBlocks.length).toBe(0);

    // ... Additional assertions for UI behavior based on no logs found scenario
  });
});
