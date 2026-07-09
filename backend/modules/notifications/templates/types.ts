/** Locale key for future i18n – default: German. */
export type NotificationLocale = 'de';

export type TemplateString = string;

export interface OrderTemplateVars {
  clubName: string;
  displayNumber: string;
  eventDateLabel: string;
  itemsHtml: string;
  itemsText: string;
  totalPrice: string;
  statusUrl: string;
  cancellationDeadlineLabel: string;
  cancellationNoteHtml: string;
  cancellationNoteText: string;
  contactHtml: string;
  contactText: string;
  customBlockHtml: string;
  legalNoticeHtml: string;
  privacyFooterHtml: string;
}

export interface OrderCancellationTemplateVars extends OrderTemplateVars {
  introHtml: string;
  introText: string;
  cancelledAtLabel: string;
}

export interface StaffAlertTemplateVars {
  clubName: string;
  displayNumber: string;
  eventDateLabel: string;
  totalPrice: string;
  detailLine: string;
}

export interface PaymentAlertTemplateVars {
  clubName: string;
  displayNumber: string;
  amount: string;
  reason: string;
  providerLabel: string;
}

export interface ModuleAlertTemplateVars {
  clubName: string;
  moduleLabel: string;
}
