
var app = angular.module("myShoppingList", ["ngRoute"]); 
app.controller("myCtrl", function($scope,ServiceCalls,CartFactory) {
    $scope.searchString = "";
    $scope.cart = new Array();
    $scope.totalAmount = 0;
    ServiceCalls.getFruitList().then(function(response){
        $scope.fruitsList = response.data.list;
    });
    
    $scope.addToCart = function (fruits) {
       if($scope.cart.indexOf(fruits)>-1){
           var pos = $scope.cart.lastIndexOf(fruits);
           $scope.cart[pos].quantity++;
       }else{
          fruits.quantity++;
          $scope.cart.push(fruits);    
       }     
       $scope.totalAmount = _.sumBy($scope.cart,function(item){
           return item.quantity*item.price;
       });
       $scope.cartLength = _.sumBy($scope.cart,"quantity");
       CartFactory.setCartDetails($scope.cart);
    }
});
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "main.htm"
    })
    .when("/details/:id", {
        templateUrl : "product-details.htm",
        controller : "productDetailsController"
    })
    .when("/cart", {
        templateUrl : "cart.htm",
        controller : "cartController"
    })
});
app.controller("productDetailsController",function($scope, $routeParams,ServiceCalls,CartFactory){
    $scope.currentId = $routeParams.id;
    $scope.cart = CartFactory.getCartDetails();
    $scope.cartLength = _.sumBy($scope.cart,"quantity");
    $scope.totalAmount = _.sumBy($scope.cart,function(item){
       return item.quantity*item.price;
    });
    ServiceCalls.getFruitList().then(function(response){
        $scope.fruitsList = response.data.list;
        var curr = $scope.fruitsList.filter(function( obj ) {
          return obj.id == $scope.currentId;
        });
        $scope.currentElement = curr[0];
        if($scope.cart.indexOf($scope.currentElement)>-1){
            $scope.elementInCart = true;
        }
        else{
            $scope.elementInCart = false;
        }
    });
    $scope.removeFromCart = function(){
        $scope.cart = _.remove($scope.cart,function(item){
            return $scope.currentId != item.id;
        });
    }
});
app.controller("cartController",function($scope, $routeParams,CartFactory){
    $scope.cart = CartFactory.getCartDetails();
    $scope.cartLength = _.sumBy($scope.cart,"quantity");
    $scope.totalAmount = _.sumBy($scope.cart,function(item){
       return item.quantity*item.price;
    });
    $scope.clearCart = function(){
        CartFactory.setCartDetails([]);
    }
});
app.factory("CartFactory",function(){
    var cart;
    function setCartDetails(cartDetails){
        cart = cartDetails;
    }
    function getCartDetails(){
        return cart;
    }
    return{
        setCartDetails : setCartDetails,
        getCartDetails : getCartDetails
    }
});
app.factory("ServiceCalls",function($http){
    function getFruitList(){
        return $http.get('data.json');
    }
    return {
        getFruitList : getFruitList
    }
});