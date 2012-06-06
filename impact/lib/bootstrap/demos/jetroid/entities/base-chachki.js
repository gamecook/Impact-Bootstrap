ig.module(
    'bootstrap.demos.jetroid.entities.base-chachki'
)
    .requires(
    'bootstrap.entities.base-item',
    'impact.sound'
)
    .defines(function () {
        EntityBaseChachki = EntityBaseItem.extend({
            _wmIgnore: true,
            types: null,
            id: 0,
            equipable: true,
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);

                if(settings.id)
                {
                    this.id = settings.id;
                }
                else
                {
                    this.id = this.types.indexOf(this.types.random());
                }
                this.name = this.types[this.id]
                this.addAnim('idle', 1, [this.id]);
            }
        })
    })