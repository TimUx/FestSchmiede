export function renderTemplate(
  template: string,
  vars: Record<string, string | undefined | null>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key];
    return value == null ? '' : String(value);
  });
}
