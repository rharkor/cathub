import { bytesToMegabytes, sleep, stringToSlug } from "./utils"

describe("Utils", () => {
  describe("bytesToMegabytes", () => {
    it("should convert bytes to megabytes correctly", () => {
      // 1 MB = 1,048,576 bytes
      expect(bytesToMegabytes(1048576)).toBe(1)
      expect(bytesToMegabytes(2097152)).toBe(2)
      expect(bytesToMegabytes(524288)).toBe(0.5)
    })

    it("should round megabytes when specified", () => {
      expect(bytesToMegabytes(1048576 * 1.2345, true)).toBe(1.23)
      expect(bytesToMegabytes(1048576 * 2.789, true)).toBe(2.79)
      expect(bytesToMegabytes(1048576 * 0.5555, true)).toBe(0.56)
    })
  })

  describe("stringToSlug", () => {
    it("should convert strings to slugs correctly", () => {
      expect(stringToSlug("Hello World")).toBe("hello-world")
      expect(stringToSlug("Test String with Spaces")).toBe("test-string-with-spaces")
      expect(stringToSlug("Special Ch@r$")).toBe("special-chr")
      expect(stringToSlug("Multiple   Spaces")).toBe("multiple-spaces")
      expect(stringToSlug("file.jpg")).toBe("filejpg")
      expect(stringToSlug("Test-With-Dashes")).toBe("test-with-dashes")
      expect(stringToSlug("123 Numbers")).toBe("123-numbers")
    })

    it("should handle empty strings", () => {
      expect(stringToSlug("")).toBe("")
    })
  })

  describe("sleep", () => {
    it("should resolve after the specified time", async () => {
      const start = Date.now()
      await sleep(100) // 100ms
      const elapsed = Date.now() - start

      // Allow some flexibility in timing (between 90ms and 150ms)
      expect(elapsed).toBeGreaterThanOrEqual(90)
      expect(elapsed).toBeLessThan(150)
    })

    it("should not block execution", async () => {
      let flag = false
      const sleepPromise = sleep(50).then(() => {
        flag = true
      })

      expect(flag).toBe(false)
      await sleepPromise
      expect(flag).toBe(true)
    })
  })
})
