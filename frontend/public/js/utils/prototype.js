(function (angular) {


	var prototypeController = function ($filter) {

		this.load = function () {

			Number.prototype.addMaskMoney = function () {
				return $filter('currency')(this.valueOf());
			};

			String.prototype.removeMaskMoney = function () {
				return parseFloat(this.replace(/[.]+/g, '').replace(',', '.').replace('R$', ''));
			};

			String.prototype.addMaskCpfCnpj = function () {
				if (this.length == 11)
					return $filter('brCpf')(this);
				else
					return $filter('brCnpj')(this);
			};

			String.prototype.convertToDate = function () {
				var year, month, day;
				year = this.slice(0, 4);
				month = this.slice(5, 7);
				day = this.slice(8, 10);
				return new Date(year, month - 1, day);
			};

		}
	}

	prototypeController.$inject = ['$filter'];

	angular.module('sce').service('PrototypeController', prototypeController);

})(angular);
