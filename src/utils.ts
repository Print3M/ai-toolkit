export interface RetryOptions {
    retries: number
    msInterval: number
    msTimeout?: number
}

export const retryWithTimeout = async <T>(
    fn: () => Promise<T>,
    options: RetryOptions
): Promise<T> => {
    const { retries, msTimeout, msInterval } = options

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if (msTimeout) {
                return await promiseWithTimeout(fn(), msTimeout)
            } else {
                return await fn()
            }
        } catch (err) {
            if (attempt === retries) throw err

            await sleep(msInterval)
        }
    }

    throw new Error("Unreachable")
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

const promiseWithTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Timeout")), ms)
        promise
            .then(val => {
                clearTimeout(timer)
                resolve(val)
            })
            .catch(err => {
                clearTimeout(timer)
                reject(err)
            })
    })
}
