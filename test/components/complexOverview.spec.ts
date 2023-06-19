import { ComplexOverview } from '@/components/complexOverview'
import { ComplexOverview as Overview } from '@/types'
import { describe, beforeEach, it, expect } from '@jest/globals'

describe('ComplexOverview', () => {
  let element: ComplexOverview

  beforeEach(() => {
    element = new ComplexOverview()
  })

  it('should render the component', () => {
    expect(element).toBeDefined()
  })
})
