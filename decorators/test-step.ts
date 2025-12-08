/**
 * Test Step Decorators for enhanced test readability and reporting
 * Modern decorator implementation using Playwright's built-in test.step()
 */

import { test } from "@playwright/test";

/**
 * Modern Test Step Decorator
 * Uses Playwright's built-in test.step() for optimal integration with reports and traces
 * 
 * Usage:
 * @step
 * async methodName() { ... }
 * 
 * Will appear in reports as: "ClassName.methodName"
 */
export function step(target: Function, context: ClassMethodDecoratorContext) {
    return function replacementMethod(this: any, ...args: any[]) {
        const name = this.constructor.name + '.' + (context.name as string);
        return test.step(name, async () => {
            return await target.call(this, ...args);
        });
    };
}
