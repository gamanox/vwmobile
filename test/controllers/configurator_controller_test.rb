require 'test_helper'

class ConfiguratorControllerTest < ActionController::TestCase
  test "should get category" do
    get :category
    assert_response :success
  end

  test "should get subcategory" do
    get :subcategory
    assert_response :success
  end

  test "should get car" do
    get :car
    assert_response :success
  end

  test "should get transmission" do
    get :transmission
    assert_response :success
  end

  test "should get color" do
    get :color
    assert_response :success
  end

  test "should get price" do
    get :price
    assert_response :success
  end

end
