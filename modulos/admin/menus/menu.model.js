var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MenuSchema = new Schema({
    name: String,
    items: Schema.Types.Mixed/*[{
        id: String,
        title: String,
        subtitle: String,
        type: String,
        hidden: Boolean,
        active: Boolean,
        disabled: Boolean,
        tooltip: String,
        link: String,
        externalLink: Boolean,
        target: String,

        exactMatch: Boolean,
        isActiveMatchOptions: Schema.Types.Mixed,
        classes: {
            title: String,
            subtitle: String,
            icon: String,
            wrapper: String,
        },
        icon: String,
        badge: {
            title: String,
            classes: String,
        },
        children: [{type: MenuSchema}],
        meta: Schema.Types.Mixed
    }]*/
});


module.exports = mongoose.model('Menu', MenuSchema);
