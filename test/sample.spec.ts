import { greet } from '@/share/greet'
import { describe, it, expect } from '@jest/globals'

describe('greet', () => {
  it('should return a greeting with the given name', () => {
    expect(greet('John')).toBe('Hello John!')
    expect(greet('Jane')).toBe('Hello Jane!')
  })

  it('should handle empty string input', () => {
    expect(greet('')).toBe('Hello !')
  })
})
