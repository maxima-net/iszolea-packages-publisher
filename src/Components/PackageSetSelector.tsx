import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProject } from '../store/publishing/actions';
import { AppState, Publishing } from '../store/types';
import PackageSet from '../packages/package-set';

export interface PackageSetSelectorProps {
  onSelectionChanged?: (selectedPackageSet: PackageSet | undefined) => void;
}

const PackageSetSelector: React.FC<PackageSetSelectorProps> = ({ onSelectionChanged }) => {
  const { availablePackages, selectedPackageSet } = useSelector<AppState, Publishing>((state) => state.publishing);

  let selectedPackageIndex: number | undefined = undefined;
  const options = availablePackages.map((p, i) => {
    if (p === selectedPackageSet) {
      selectedPackageIndex = i;
    }
    return <option key={i} value={i}>{p.projectsInfo.map((pi) => pi.name).join(', ')}</option>;
  });

  const dispatch = useDispatch();

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const packageSetIndex = +e.target.value;
    let selectedPackageSet = undefined;

    if (!isNaN(packageSetIndex)) {
      selectedPackageSet = availablePackages[packageSetIndex];
      dispatch(selectProject(selectedPackageSet));
    }

    onSelectionChanged && onSelectionChanged(selectedPackageSet);
  };

  return (
    <div className="input-field">
      <select
        value={selectedPackageIndex !== undefined ? selectedPackageIndex : ''}
        onChange={handleProjectChange}>
        <option value="" disabled>Select project</option>
        {options}
      </select>
      <label>Project</label>
    </div>
  );
};

export default PackageSetSelector;
