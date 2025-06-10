export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  Appointments: undefined;
  Orders: undefined;
  Services: undefined;
  NotificationPreferences: undefined;
  Reports: undefined;
  CustomerManagement: undefined;
};

export type TabParamList = {
  Home: undefined;
  Book: undefined;
  Shop: undefined;
  Membership: undefined;
  Profile: undefined;
  Admin: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}