import React from 'react/lib/ReactWithAddons'
import { mount } from 'enzyme'
import { compClass, compData, compSelector } from '../../mock/select.js'
import Select from '../../../src/Select.js'

describe('Basic', () => {
  const {dataList1, dataList2} = compData,

    _defaultSingleWrapper = mount(
      <Select placeholder="single" data={dataList1} />
    ),
    _defaultObjectWrapper = mount(
      <Select data={dataList2} groupBy="type" />
    ),
    _defaultMultiObjectWrapper = mount(
      <Select
        mult={true}
        placeholder="multiple"
        data={dataList2}
        groupBy="type" />
  )

  describe('Common', () => {
    it('Should apply correct size by data list', () => {
      const _optionsWrapper1 = _defaultSingleWrapper.find(compClass.select).find(compClass.options),
        _optionsWrapper2 = _defaultMultiObjectWrapper.find(compClass.select).find(compClass.options)

      expect(_optionsWrapper1).to.have.exactly(dataList1.length).descendants(compSelector.showItem)
      expect(_optionsWrapper2).to.have.exactly(dataList2.length).descendants(compSelector.showItem)
    })

    it('Should apply correct text by placeholder', () => {
      expect(_defaultSingleWrapper).to.include.text('single')
      expect(_defaultMultiObjectWrapper).to.include.text('multiple')
    })

    it('Should render by value', () => {
      const wrapper1 = mount(<Select data={dataList1} value='foo' />),
        wrapper2 = mount(<Select mult={true} data={dataList1} value={['foo', 'bar']} />),
        _selectWrapper1 = wrapper1.find(compClass.select),
        _selectWrapper2 = wrapper2.find(compClass.select)

      expect(_selectWrapper1.find('span').at(0)).to.have.text('foo')
      expect(_selectWrapper2.find(compSelector.multSelectResultContainer).at(0)).to.have.text('foo')
      expect(_selectWrapper2.find(compSelector.multSelectResultContainer).at(1)).to.have.text('bar')
    })

    it('Should apply correct Class by grid prop', () => {
      const wrapper1 = mount(<Select data={dataList2} grid={{width: 1 / 2}} />),
        wrapper2 = mount(<Select data={dataList2} grid={{width: 1 / 4, offset: 1 / 4}} />),
        wrapper3 = mount(<Select mult={true} data={dataList2} grid={{width: 1 / 2, offset: 1 / 2, responsive: 'xl'}} />),
        _selectWrapper1 = wrapper1.find(compClass.select),
        _selectWrapper2 = wrapper2.find(compClass.select),
        _selectWrapper3 = wrapper3.find(compClass.select)

      expect(_selectWrapper1).to.have.className('rct-grid-md-50-000')

      expect(_selectWrapper2).to.have.className('rct-grid-md-25-000')
      expect(_selectWrapper2).to.have.className('rct-offset-md-25-000')

      expect(_selectWrapper3).to.have.className('rct-grid-xl-50-000')
      expect(_selectWrapper3).to.have.className('rct-offset-xl-50-000')
    })
  })

  describe('Single', () => {
    describe('Should render by Tpl', () => {
      const wrapper1 = mount(<Select
                               data={dataList2}
                               optionTpl='{type}-{content}'
                               resultTpl='{content}'
                               valueTpl='{content}' />),
        _optionsWrapper1 = wrapper1.find(compSelector.showItem)

      it('Should render by default Tpl', () => {
        const _defaultOptionsWrapper = _defaultObjectWrapper.find(compClass.select).find(compClass.options)

        _defaultOptionsWrapper.find(compSelector.showItem).forEach((e, i) => {
          expect(e).to.have.text(compData.dataList1[i])
        })
      })

      it('Should render by optionTpl', () => {
        _optionsWrapper1.forEach((e, i) => {
          expect(e).to.have.text(`${compData.dataList2[i].type}-${compData.dataList2[i].content}`)
        })
      })

      it('Should render by resultTpl and valueTpl', () => {
        _optionsWrapper1.forEach((e, i) => {
          e.simulate('click')
          expect(wrapper1.instance().getValue()).to.equal(compData.dataList2[i].content)
        })
      })

      it('Should render by valueTpl', () => {
        _optionsWrapper1.forEach((e, i) => {
          e.simulate('click')
          expect(wrapper1.find('span').at(0)).to.have.text(compData.dataList2[i].content)
        })
      })
    })
  })

  describe('Mutiple', () => {
    it('Should apply correct group number by groupBy key', () => {
      const _groupWrapper1 = _defaultMultiObjectWrapper.find(compClass.options).find('ul')

      expect(_groupWrapper1).to.have.exactly(2).descendants('span')
    })

    it('Should return value by sep', () => {
      const sep = ':',
        wrapper1 = mount(<Select mult={true} data={dataList1} sep={sep} />),
        _selectWrapper1 = wrapper1.find(compClass.select),
        _optionsWrapper1 = _selectWrapper1.find(compClass.options)

      _optionsWrapper1.find('ul').find(compSelector.showItem).at(0).simulate('click')
      _optionsWrapper1.find('ul').find(compSelector.showItem).at(1).simulate('click')

      expect(wrapper1.instance().getValue()).to.equal(['foo', 'bar'].join(sep))
    })
  })
})
