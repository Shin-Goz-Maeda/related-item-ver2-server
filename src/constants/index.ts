exports.CLIENT_REQUEST_DOMAIN = process.env.CLIENT_REQUEST_DOMAIN;

exports.PORT = process.env.PORT || 3001;

exports.MAIL_VERIFIED_STATE = {
  not_email_verified: 0,
  ok_email_verified: 1,
};

exports.USER_STATE = {
  user_subscribed: 0,
  user_unSubscribed: 1,
};

exports.DATE = {
  created_at: Date.now(),
  updated_at: Date.now(),
};
