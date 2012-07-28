ig.module(
    'game.plugins.string-utils'
)
    .requires(
)
    .defines(function(){

        /**
         *
         * @param length
         * @return {*}
         */
        String.prototype.padString = function (length) {
            var str = this;
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        }


        String.prototype.capitaliseFirstLetter = function()
        {
            var str = this;
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

    }
)