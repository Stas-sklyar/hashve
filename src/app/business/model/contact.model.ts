export class Contact {
    _id: string;
    fullName: string;
    mobile: string;
    mail: string;
    pic: string;
    country: string;
    birthday: string;
    sms: string;
    userType: string;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this._id = contact._id || '';
            this.fullName = contact.fullName || '';
            this.mobile = contact.mobile || '';
            this.mail = contact.mail;
            this.pic = (contact.pic === '' || contact.pic === undefined) ? 'assets/avatar/profile.jpg' : contact.pic;
            this.country = contact.country || '';
            this.birthday = contact.birthday || '';
            this.sms = contact.sms || '';
            this.userType = contact.userType || '';
            this.lastLogin = contact.lastLogin || '';
            this.createdAt = contact.createdAt || '';
            this.updatedAt = contact.updatedAt || '';
        }
    }
}
