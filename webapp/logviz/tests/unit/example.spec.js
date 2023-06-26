import { mount } from '@vue/test-utils'
import { expect } from 'chai'
import IDForm from '../../src/components/IDForm.vue'
import  axios from 'axios'
import  MockAdapter from 'axios-mock-adapter'
const chai = require('chai');
const sinonChai = require('sinon-chai');

// Initialize Chai with Sinon-Chai
chai.use(sinonChai);

// Create a spy using Sinon
// Create a spy using Sinon
// Assign the Chai assertion library to a variable



describe('IDForm Component', () => {
  let mock

  beforeEach(() => {
    // Create a mock instance of axios
    mock = new MockAdapter(axios.create())

    // Set up the mock response for the API call
    const responseData = [{ id: 1, message: 'Mock response' }]
    mock.onGet('http://127.0.0.1:8000/search-logs/').reply(200, responseData)
  })

  afterEach(() => {
    // Clean up the mock
    mock.restore()
  })

  it('displays the form correctly', () => {
    const wrapper = mount(IDForm)
    
    const label = wrapper.find('label')
    expect(label.text()).to.equal('Correlation ID:')
    
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).to.be.true
    
    const submitButton = wrapper.find('button.yes')
    expect(submitButton.text()).to.equal('Submit')
  })

  it('calls the submit method and displays the result', async () => {
    const responseData = [{ id: 1, message: 'Mock response' }]
    mock.onGet('http://127.0.0.1:8000/search-logs/').reply(200, responseData)

    const wrapper = mount(IDForm)

    // Set the input value
    const input = wrapper.find('input[type="text"]')
    await input.setValue('id005')

    // Trigger the form submission
    await wrapper.find('button.yes').trigger('click')
    await wrapper.vm.submit()

    // Wait for the API call to resolve
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.result').isVisible()).toBe(true)

    // Assert that the result section is visible
    // const resultSection = wrapper.find('.result')
    // expect(resultSection.exists()).to.be.true

    // // Assert that the flowchart is rendered
    // const flowchart = resultSection.find('.flowchart')
    // expect(flowchart.exists()).to.be.true

    // Assert the rendered service name in the flowchart
    // const service = flowchart.find('.log-block h4')
    // expect(service.text()).to.equal('Mock Service')

    // // Assert the logs are rendered
    // const logs = wrapper.findAll('.box li')
    // expect(logs.length).to.equal(1)
    // expect(logs[0].text()).to.contain('Mock log message')
  })

  it('displays an error message when no logs are found', async () => {
    mock.onGet('http://127.0.0.1:8000/search-logs/').reply(404)

    const wrapper = mount(IDForm)

    // Set the input value
    const input = wrapper.find('input[type="text"]')
    await input.setValue('id009')

    // Trigger the form submission
    await wrapper.find('button.yes').trigger('click')
    await wrapper.vm.submit()

    // Wait for the API call to resolve
    await wrapper.vm.$nextTick()

    // Assert that the error message is displayed
    const errorMessage = wrapper.find('.errorMessage')
    expect(errorMessage.text()).to.equal('No logs found with LogCorrelationId id009')
  })
})


